import "./styles/App.css";
import Projectcard from "./components/projectcard";

function App() {
  return (
    <>
      <Projectcard
        title="Pop"
        languages="Unity"
        description="A web game I produced with my 2 brothers. A peacful top-down shoot which synchronizes the enemy waves with it's music track."
        imagesrc={"./projectpics/Poppic.PNG"}
        imagealt="Pop Pic"
        link="https://gage-langdon.com/pop/"
      />
    </>
  );
}

export default App;
