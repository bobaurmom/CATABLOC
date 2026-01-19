import logo from "../assets/logo.svg";
import Btn from "../component/ui/button";

function Home() {
  return (
    <main className="main-content flex justify-center items-center h-screen">
      <div className="home-container flex flex-col items-center gap-6 text-center">
        <img src={logo} style={{ width: "100px", height: "auto" }} />
        <h1 className="font-bold text-4xl">
          Start <br /> Your Learning Now
        </h1>
        <p>Explore the most fun game while learning algorithms</p>
        <a href="/login">
          <Btn text="Start Now" />
        </a>
      </div>
    </main>
  );
}

export default Home;
