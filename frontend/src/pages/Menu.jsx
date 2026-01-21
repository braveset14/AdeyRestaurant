import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';

const menuData = [
  // NON-FASTING
  { id: 1, name: "Doro Wat", category: "non-fasting", price: "450 ETB", img: "image/doro_wat.jpg" },
  { id: 2, name: "Sega Wat", category: "non-fasting", price: "380 ETB", img: "image/sega_wat.jpg" },
  { id: 3, name: "Kitfo", category: "non-fasting", price: "500 ETB", img: "image/kitfo.jpg" },
  
  // FASTING
  { id: 4, name: "Beyaynetu", category: "fasting", price: "300 ETB", img: "image/beyaynetu.jpg" },
  { id: 5, name: "Misir Wat", category: "fasting", price: "200 ETB", img: "image/misir.jpg" },
  { id: 6, name: "Shiro Wat", category: "fasting", price: "180 ETB", img: "image/shiro.jpg" },
  
  //Snacks
  { id: 7, name: "Sambusa", category: "snacks", price: "60 ETB", img: "image/sambusa.jpg" },
  { id: 8, name: "Kolo", category: "snacks", price: "40 ETB", img: "image/kolo.jpg" }
];

function Menu() {
  const [activeTab, setActiveTab] = useState('non-fasting');
  const [searchTerm,setSearchTerm]=useState('');
  const filteredItems = menuData.filter(
    item => {
        const matchesCategory=item.category === activeTab;
        const matchesSearch=item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

  return (
    <div className="menu-bg">
      <div className="menu-container">
        <h1 className="menu-title">Adey's Kitchen</h1>

        {/* 3. Search Bar Input */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a dish (e.g. 'Doro')..." 
            className="menu-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="menu-nav">
          <button 
            className={activeTab === 'fasting' ? 'nav-link active' : 'nav-link'} 
            onClick={() => { setActiveTab('fasting'); setSearchTerm(''); }}
          >Fasting</button>
          
          <button 
            className={activeTab === 'non-fasting' ? 'nav-link active' : 'nav-link'} 
            onClick={() => { setActiveTab('non-fasting'); setSearchTerm(''); }}
          >Non-Fasting</button>
          
          <button 
            className={activeTab === 'snacks' ? 'nav-link active' : 'nav-link'} 
            onClick={() => { setActiveTab('snacks'); setSearchTerm(''); }}
          >Snacks</button>
        </div>

        <div className="foods">
          <h2 className="type">
            {searchTerm ? `Results for "${searchTerm}"` : activeTab.toUpperCase()}
          </h2>
          <div className="containers">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <MenuCard key={item.id} item={item} />
              ))
            ) : (
              <p style={{ color: 'white', fontSize: '20px' }}>No dishes found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;