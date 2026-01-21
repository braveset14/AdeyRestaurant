function MenuCard({ item }) {
    return (
      <div className="food">
        <img src={item.img} alt={item.name} />
        <h3>{item.name}</h3>
        <p>{item.price}</p>
        <button>Order Now</button>
      </div>
    );
  }
  
  export default MenuCard;