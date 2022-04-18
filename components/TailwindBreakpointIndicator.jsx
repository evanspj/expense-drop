export default function TailwindBreakpointIndicator() {
  return (
    <div className="print:hidden fixed bottom-2 right-2 bg-indigo-500 text-white text-sm rounded-full shadow-lg px-4 py-2 z-50">
      <p className="md:hidden">sm</p>
      <p className="hidden md:block lg:hidden">md</p>
      <p className="hidden lg:block xl:hidden">lg</p>
      <p className="hidden xl:block 2xl:hidden">xl</p>
      <p className="hidden 2xl:block 3xl:hidden">2xl</p>
      <p className="hidden 3xl:block">3xl</p>
    </div>
  );
}
