interface ModalType {
  title?: string;
  label: string;
  setModalOpen: (open: boolean) => void;
  primaryBtnTxt?: string;
  secondaryBtnTxt?: string;
}

const CustomModal = ({
  title,
  label,
  setModalOpen,
  primaryBtnTxt,
  secondaryBtnTxt,
}: ModalType) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              defaultValue={title}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {primaryBtnTxt}
            </button>
            <button className="px-4 py-2 bg-indigoTags text-white rounded-lg hover:bg-indigoTags/80 cursor-pointer transition-colors">
              {secondaryBtnTxt}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
