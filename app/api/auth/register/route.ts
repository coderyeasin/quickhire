import { loginValidation } from "@/components/Auth/Login/LoginValidators";
import { connectToDB } from "@/lib/mongodb";
import { UserModel } from "@/modules/user/user.model";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import * as bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // Accept multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const avatar = formData.get("avatar");

    // Validate using Zod
    const data = loginValidation.parse({
      name,
      email,
      password,
      confirmPassword,
      avatar: avatar,
    });

    await connectToDB();

    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    // Upload image to Cloudinary
    let imageUrl = undefined;
    if (avatar && typeof avatar !== "string") {
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "dev-event/users",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(buffer);
      });
      imageUrl = (uploadResult as { secure_url: string }).secure_url;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      avatar: imageUrl,
    });

    return NextResponse.json(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
