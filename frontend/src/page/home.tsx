import logo from "../assets/logo.svg";
import Btn from "../component/ui/button";

function Home() {
  return (
    <main className="main-content">
      <div style={{ textAlign: "center", padding: "100px" }}>
        <img src={logo} style={{ width: "100px", height: "auto" }} />
        <h1>
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
