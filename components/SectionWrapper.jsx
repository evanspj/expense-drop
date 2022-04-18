export default function SectionWrapper({
  children,
  sectionLabel = '',
  detailPage = false
}) {
  return (
    <section className="space-y-4 px-4">
      <h2 className="text-lg font-bold pl-4 lg:pl-2">{sectionLabel}</h2>
      {detailPage ? (
        <div className="xl:flex space-y-4 xl:space-y-0 xl:space-x-4">
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </section>
  );
}
