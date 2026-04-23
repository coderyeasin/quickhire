// High-Order Function --- routeCtx for dynamic routes

import { NextRequest, NextResponse } from "next/server";

type NextHandler = (req: NextRequest, routeCtx?: any) => Promise<NextResponse>;

const catchAsync = (fn: NextHandler) => {
  return async (req: NextRequest, routeCtx: any) => {
    try {
      return await fn(req, routeCtx);
    } catch (error: any) {
      console.error("API Error", error);
      return NextResponse.json(
        {
          success: false,
          message: error?.message || "Internal Server Error",
        },
        { status: error?.status || 500 },
      );
    }
  };
};

export default catchAsync;
