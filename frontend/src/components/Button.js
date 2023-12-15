function Button({ text, onClick, className }) {
    return (
      <button className={`mi-clase-btn ${className}`} onClick={onClick}>
        {text}
      </button>
    );
  }
  
  export default Button;
  