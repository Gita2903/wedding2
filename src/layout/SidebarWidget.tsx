export default function SidebarWidget() {
  return (
    <div className="pb-20">
      <div
        className="
        mx-auto rounded-2xl bg-brand-50 px-4 py-5 text-center dark:bg-brand-500/10"
      >
        <h3 className="mb-2 font-semibold text-brand-900 dark:text-brand-100">
          Butuh Bantuan?
        </h3>
        <p className="mb-4 text-brand-700 text-theme-sm dark:text-brand-300">
          Konsultasikan persiapan pernikahanmu dengan tim ahli kami.
        </p>
        <a
          href="#"
          className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
        >
          Hubungi Planner
        </a>
      </div>
    </div>
  );
}
