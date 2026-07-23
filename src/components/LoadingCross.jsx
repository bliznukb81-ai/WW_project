export default function LoadingCross() {
  return (
    <div className="flex items-center justify-center py-20 bg-white">
      <div className="relative w-24 h-24 animate-cross-pulse">
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
          <div className="bg-transparent"></div> <div className="bg-black"></div> <div className="bg-transparent"></div>
          <div className="bg-black"></div>       <div className="bg-black"></div> <div className="bg-black"></div>
          <div className="bg-transparent"></div> <div className="bg-black"></div> <div className="bg-transparent"></div>
        </div>
      </div>
    </div>
  );
}