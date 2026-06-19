import logo from "../assets/logo.svg";
import Btn from "../component/ui/Button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="main-content flex justify-center items-center h-screen">
      <div className="home-container flex flex-col items-center gap-6 text-center">
        <img src={logo} alt="catabloc logo" className="w-25" />
        <h1 className="font-bold text-4xl">
          Start <br /> Your Learning Now
        </h1>
        <p>Explore the most fun game while learning algorithms</p>
        <Link to="/login">
          <Btn>
            Start Now
          </Btn>

        </Link>
      </div>
    </main>
  );
}

export default Home;
