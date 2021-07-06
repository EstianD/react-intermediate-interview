import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const url = "https://randomuser.me/api/?results=20";

const flattenObject = (locationObj) => {
  let newObj = {};
  const keys = Object.keys(locationObj);
  keys.forEach((key) => {
    if (typeof locationObj[key] == "object") {
      let innerKeys = Object.keys(locationObj[key]);
      innerKeys.forEach((innerKey) => {
        newObj[innerKey] = locationObj[key][innerKey];
      });
    } else {
      newObj[key] = locationObj[key];
    }
  });
  return newObj;
  // console.log(keys);
};

function fetchData() {
  return axios
    .get(url)
    .then((res) => {
      const { results } = res.data;
      return results;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Sort alphabetically
function sortAlpha(element, arr) {
  return arr.sort((a, b) => {
    if (a[element] < b[element]) {
      return -1;
    }
    if (a[element] > b[element]) {
      return 1;
    }
    return 0;
  });
}

// Sort reverse alphabetically
function sortReverse(element, arr) {
  return arr.sort((a, b) => {
    if (a[element] > b[element]) {
      return -1;
    }
    if (a[element] < b[element]) {
      return 1;
    }
    return 0;
  });
}

function App() {
  const [data, setData] = useState([]);
  const [sorted, setSorted] = useState(null);
  const [sortingElement, setSortingElement] = useState("");

  function handleSort(e) {
    const { innerText } = e.target;
    setSortingElement(innerText);

    if (innerText === sortingElement) {
      setSorted((prevState) => !prevState);
    } else {
      setSorted(true);
    }
  }

  function sortData(element) {
    let arr = [...data];
    let sortedArr = [];

    // If same element gets toggled
    if (element === sortingElement) {
      if (sorted) {
        sortedArr = sortAlpha(element, arr);
      } else {
        sortedArr = sortReverse(element, arr);
      }
    }

    // If different element get toggled
    if (element !== sortingElement) {
      if (!sorted) {
        sortedArr = sortAlpha(element, arr);
      } else {
        sortedArr = sortReverse(element, arr);
      }
    }

    setData(sortedArr);
  }

  useEffect(() => {
    let ObjArray = [];
    fetchData().then((userLocations) => {
      for (let index in userLocations) {
        ObjArray.push(flattenObject(userLocations[index].location));
      }
      setData(ObjArray);
    });
  }, []);

  useEffect(() => {
    if (sortingElement !== "") {
      sortData(sortingElement);
    }
  }, [sorted, sortingElement]);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th onClick={handleSort}>city</th>
            <th onClick={handleSort}>country</th>
            <th onClick={handleSort}>description</th>
            <th onClick={handleSort}>name</th>
            <th onClick={handleSort}>number</th>
            <th onClick={handleSort}>state</th>
            <th onClick={handleSort}>postcode</th>
            <th onClick={handleSort}>latitude</th>
            <th onClick={handleSort}>longitude</th>
            <th onClick={handleSort}>offset</th>
          </tr>
        </thead>
        <tbody>
          {data.map((location, index) => (
            <tr key={index}>
              <td>{location.city}</td>
              <td>{location.country}</td>
              <td>{location.description}</td>
              <td>{location.name}</td>
              <td>{location.number}</td>
              <td>{location.state}</td>
              <td>{location.postcode}</td>
              <td>{location.latitude}</td>
              <td>{location.longitude}</td>
              <td>{location.offset}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
