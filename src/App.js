import React from "react";
import Footer from "./Footer";
import DateTable from "./DateTable/DateTable";

function App() {
  return (
    <React.Fragment>
      <div className="App">
        <DateTable />
      </div>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
