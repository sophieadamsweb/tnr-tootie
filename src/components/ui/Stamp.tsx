// The round "Trapper in Training" stamp on the last step. It thunks down
// with a little animation (the .stamp class in globals.css).
//
// It says "in training" on purpose. The last step tells you to go get real TNR
// certification, so the lesson shouldn't pretend to certify you.
export function Stamp() {
  return (
    <div
      className="stamp grid h-32 w-32 shrink-0 -rotate-[8deg] place-items-center rounded-full border-[5px] border-double border-tomato text-center font-display font-black uppercase leading-tight text-tomato"
      role="img"
      aria-label="Trapper in Training stamp"
    >
      <span aria-hidden="true">
        <span className="block text-xs tracking-widest">★ TNR ★</span>
        <span className="block text-lg">Trapper</span>
        <span className="block text-xs tracking-wider">in training</span>
      </span>
    </div>
  );
}
