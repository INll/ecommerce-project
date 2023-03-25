import * as Scroll from 'react-scroll';

export default function SideLink({ to, config, text, inview }) {
  let ScrollLink = Scroll.Link;

  return (
    <ScrollLink to={to} smooth={config.smooth} duration={config.duration} offset={config.offset}>
      <li className={`tracking-wider border-l-2 py-[0.53rem] px-4 cursor-pointer hover:text-indigo-300 ${inview ? 'bg-indigo-400/20' : null}`}>{text}</li>
    </ScrollLink>
  )
}
