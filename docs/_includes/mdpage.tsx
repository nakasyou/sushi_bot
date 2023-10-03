import Base from './base.tsx'

export default (props: {
  title: string
  styles: string[]
  children: JSX.Element
}) => {
  const styles: string[] = [...(props.styles || []), `
    .md h1 {
      font-size: 2em;
      font-weight: bolder;
    }
    .md h2 {
      font-size: 1.5em;
      font-weight: bolder;
    }
    .md h3 {
      font-size: 1.17em;
      font-weight: bolder;
    }
    .md h4 {
      font-size: 1em;
      font-weight: bolder;
    }
    .md h5 {
      font-size: .83em;
      font-weight: bolder;
    }
    .md h6 {
      font-size: .83em;
      font-weight: bolder;
    }
    .md p {
      margin-top: 1em;
      margin-bottom: 1em;
    }
    .md a {
      text-decoration: underline;
    }
    .md a:hover {
      text-decoration: none;
    }
  `]
  return <Base title={props.title} styles={styles} >
    <div class="md mx-5">
      { props.children }
    </div>
  </Base>
}
