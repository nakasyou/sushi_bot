import Base from './base.tsx'

export default (props: {
  title: string
  styles: string[]
  children: JSX.Element
}) => {
  const styles: string[] = [...(props.styles || []), `
    .md h1 {
      font-size: 2em;
    }
    .md h2 {
      font-size: 1.5em;
    }
  `]
  return <Base title={props.title} styles={styles} >
    <div class="md mx-5">
      { props.children }
    </div>
  </Base>
}
