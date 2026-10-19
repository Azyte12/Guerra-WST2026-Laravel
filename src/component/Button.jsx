function Button() {
    function handleClick() {
        alert('Button clicked');
        console.log('Button clicked');
    }

    return (
        <button className="btn" onClick={handleClick}>
            Click Me
        </button>
    );
}

export default Button;