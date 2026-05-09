import { login } from './actions'

const Page = () => {
  return (
    <form
      action={login}
      className="bg-black h-screen w-full text-white flex flex-col justify-center items-center"
    >
      only workers
      <input
        type="password"
        name="password"
        className="border border-red-700"
      />
      <button type="submit">log in</button>
    </form>
  )
}

export default Page