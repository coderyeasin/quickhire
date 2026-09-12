"use client";

import { GeneratedDescriptionProps } from "@/types/interfaces";

const GeneratedDescription = ({
  description,
  onUse,
  onDiscard,
}: GeneratedDescriptionProps) => {
  return (
    <div className="rounded-xl border border-indigoTags/20 bg-indigoTags/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-dark-text">
            AI Generated Description
          </h4>

          <p className="mt-1 text-xs text-primary-gray">
            Review the content before adding it to your job.
          </p>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigoTags">
          AI Draft
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
        <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {description}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onUse}
          className="rounded-lg bg-indigoTags cursor-pointer px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigoTags/90"
        >
          Use Description
        </button>

        <button
          type="button"
          onClick={onDiscard}
          className="rounded-lg bg-slate-100 cursor-pointer px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-200"
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default GeneratedDescription;
