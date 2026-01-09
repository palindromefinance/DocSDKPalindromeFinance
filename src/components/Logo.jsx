function LogomarkPaths() {
  return (
    <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth={3}>
      <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z" />
      <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z" />
    </g>
  )
}

export function Logomark(props) {
  return <img src={props.logo.src} className="h-10 w-auto" alt="Palindrome Crypto Pay - Secure Escrow SDK" />
}

export function Logo(props) {
  return <img src={props.logo.src} className="h-14 w-auto" alt="Palindrome Crypto Pay - Blockchain Escrow Payment Solution" />
}
