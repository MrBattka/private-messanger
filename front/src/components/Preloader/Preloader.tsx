import Lottie from 'lottie-react'
import preloader from '../../common/Loader.json'

const Preloader = () => {
  return (
    <Lottie
      animationData={preloader}
      style={{ width: '150px', height: '150px' }}
      loop={true}
      aria-label="Переход в чат..."
    />
  )
}

export default Preloader