import SvgIcon from "@material-ui/core/SvgIcon";

const PlusLife = (props) => (
  <SvgIcon
    preserveAspectRatio="xMidYMid meet"
    width="165.7"
    height="154.352"
    viewBox="0 0 165.7 154.352"
    {...props}
  >
    <defs>
      <filter id="heart" x="0" y="0" width="165.7" height="154.352" filterUnits="userSpaceOnUse">
        <feOffset input="SourceAlpha" />
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feFlood floodColor="#E767D9" />
        <feComposite operator="in" in2="blur" />
        <feComposite in="SourceGraphic" />
      </filter>
      <filter id="Elipse_202" x="75.85" y="51.352" width="88" height="88" filterUnits="userSpaceOnUse">
        <feOffset dx="3" input="SourceAlpha" />
        <feGaussianBlur stdDeviation="5" result="blur-2" />
        <feFlood floodOpacity="0.459" />
        <feComposite operator="in" in2="blur-2" />
        <feComposite in="SourceGraphic" />
      </filter>
    </defs>
    <g id="Grupo_260" data-name="Grupo 260" transform="translate(4572.425 -6815.648)">
      <g transform="matrix(1, 0, 0, 1, -4572.42, 6815.65)" filter="url(#heart)">
        <path id="heart-2" data-name="heart" d="M97.233,11.158a28.125,28.125,0,0,0-39.791.016l-3.409,3.45L50.651,11.18l-.022-.022a28.126,28.126,0,0,0-39.776,0L9.335,12.677a28.126,28.126,0,0,0,0,39.776L49.407,92.525l4.525,4.741.109-.109.116.116L58.4,92.8,98.752,52.449C109.719,41.458,109.719,23.664,97.233,11.158Z" transform="translate(28.9 27.08)" fill="#fff" />
      </g>
      <g transform="matrix(1, 0, 0, 1, -4572.42, 6815.65)" filter="url(#Elipse_202)">
        <circle id="Elipse_202-2" data-name="Elipse 202" cx="29" cy="29" r="29" transform="translate(87.85 66.35)" fill="#B588F7" />
      </g>
      <text id="_1" data-name="+1" transform="translate(-4455.575 6925)" fill="#fff" fontSize="36" fontFamily="Roboto-Regular, Roboto"><tspan x="-20.312" y="0">+1</tspan></text>
    </g>
  </SvgIcon>
);

export default PlusLife;
