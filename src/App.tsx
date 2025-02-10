import { useEffect, useState } from "react";
import useNetworkStatus from "./hooks/useNetworkStatus";
import {
  addData,
  deleteStore,
  getStoreData,
  initDB,
  Stores,
} from "./offlineDb/db";
import Atm from "./Atm/Atm";
import Footer from "./Footer/Footer";
import "../src/globalCSS/global.scss";
import SidebarMenu from "./Atm/SidebarMenu/SidebarMenu";

function App() {
  const [name, setName] = useState("");
  const { isOnline } = useNetworkStatus();
  const [isDbOn, setIsDbOn] = useState(false);
  const [hasDataToSync, setHasDataToSync] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const turnOnDb = async () => {
      const dbIsOn = await initDB();
      setIsDbOn(dbIsOn);
    };
    turnOnDb();
  }, [isOnline]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getStoreData<{ message: string }>(Stores.Messages);
      console.log("request message sent: ", messages);
      deleteStore(Stores.Messages);
      setHasDataToSync(false);
    };
    if (isOnline && isDbOn && hasDataToSync) {
      fetchMessages();
    }
  }, [isOnline]);

  async function greet() {
    if (isOnline) {
      console.log("request message sent: ", name);
    } else {
      try {
        await addData(Stores.Messages, { name });
        setHasDataToSync(true);
      } catch (err: unknown) {
        console.log(err, "there has been an error");
      }
    }
  }

  return (
    <>
      <main className="container">
        {isOnline ? "Has connection" : "Offline"}

        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
      </main>
      <div id="sidebarMenu">
        <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <Atm />
      <Footer toggleSidebar={toggleSidebar} />
    </>
  );
}

export default App;
