import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import './style/styles.css';
import Header from './common/header';
import Table from './common/table';
import { UserContext } from './context/UserContext';

let debounceTimer;

const tableHeaders = [
  { key: 'select', label: 'Select' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions' },
];

function Homepage() {
  const { userData, updateUserData, setFiltered } =
    useContext(UserContext);

  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function searchData(text) {
    if (!text.length) {
      setFiltered(userData);
      return;
    }
    const filteredData = userData.filter((elt) => {
      if (
        elt &&
        elt.name &&
        elt.name.toLowerCase().includes(text)
      ) {
        return elt;
      } else if (
        elt &&
        elt.email &&
        elt.email.toLowerCase().includes(text)
      ) {
        return elt;
      }
    });
    setFiltered(filteredData);
  }

  function debounceSearch(text) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(searchData, 1000, text);
  }

  async function fetchUserData() {
    setIsLoading(true);
    try {
      const data = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json',
        {
          method: 'GET',
        }
      );
      setIsLoading(false);
      const usersData = await data.json();
      updateUserData(usersData);
      setFiltered(usersData);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        debounceSearch={debounceSearch}
      />
      {isLoading ? (
        <div class='loader'></div>
      ) : (
        <Table tableHeaders={tableHeaders} />
      )}
    </>
  );
}

export default Homepage;
