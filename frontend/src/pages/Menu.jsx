import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import '../pages/styles/Menu.css';
import doro_wot from '../assets/images.jpeg';
import tibs from '../assets/hq720.jpg'
import kikil from '../assets/kikil.jpeg';
import bozena from '../assets/bozena.jpeg';
import aybe from '../assets/aybe.webp';
import kitfo from '../assets/kitfo.jpeg';
import sega from '../assets/sega_wot.jpeg';

import beyaynet from '../assets/beyaynet.jpg';
import dinich from '../assets/dinich.jpeg';
import gomen from '../assets/gomen.jpeg';
import misir from '../assets/misir.jpeg';
import shiro from '../assets/shiro.jpeg';
import pasta from '../assets/pasta.webp';
import timatim from '../assets/timatim.png';

import fetira from '../assets/fetira.jpeg';
import chiko from '../assets/chiko.jpeg';
import anebabero from '../assets/anebabero.jpeg';
import koker from '../assets/koker.jpeg';
import kolo from '../assets/kolo.jpeg';
import sambusa from '../assets/sambusa.jpeg';
const menuData = [
  // NON-FASTING
  { id: 1, name: "Doro Wat", category: "non-fasting", price: "450 ETB",img: doro_wot },
  { id: 2, name: "Sega Wat", category: "non-fasting", price: "380 ETB", img: sega },
  { id: 3, name: "Kitfo", category: "non-fasting", price: "500 ETB", img: kitfo },
  { id: 4, name: "SheklaTibs", category: "non-fasting", price: "400 ETB", img: tibs},
  { id: 5, name: "Kikil", category: "non-fasting", price: "400 ETB", img: kikil},
  { id: 6, name: "Bozena", category: "non-fasting", price: "400 ETB", img: bozena},
  { id: 7, name: "Aybe", category: "non-fasting", price: "400 ETB", img: aybe},

  // FASTING
  { id: 9, name: "Beyaynetu", category: "fasting", price: "300 ETB", img: beyaynet},
  { id: 10, name: "Misir Wat", category: "fasting", price: "200 ETB", img: misir },
  { id: 11, name: "Shiro Wat", category: "fasting", price: "180 ETB", img: shiro },
  { id: 12, name: "Dinich Wat", category: "fasting", price: "500 ETB", img: dinich },
  { id: 13, name: "Gomen", category: "fasting", price: "400 ETB", img: gomen},
  { id: 14, name: "Pasta(yetsom)", category: "fasting", price: "400 ETB", img: pasta},
  { id: 15, name: "Timatim", category: "fasting", price: "400 ETB", img: timatim},
  { id: 16, name: "Aybe", category: "fasting", price: "400 ETB", img: aybe},
  //Snacks
  { id: 17, name: "Sambusa", category: "snacks", price: "60 ETB", img: sambusa},
  { id: 18, name: "Kolo", category: "snacks", price: "40 ETB", img:kolo },
  { id: 19, name: "Koker", category: "snacks", price: "40 ETB", img:koker },
  { id: 20, name: "Fetira", category: "snacks", price: "40 ETB", img:fetira },
  { id: 21, name: "Anebabero", category: "snacks", price: "40 ETB", img:anebabero },
  { id: 22, name: "Chiko", category: "snacks", price: "40 ETB", img:chiko}
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