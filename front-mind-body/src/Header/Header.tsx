import "../Header/Header.css"
import  Logo1  from "../assets/Logo1.png" 


const Header = ()=>{
    return(
        <header className="global-header">
             <img src={Logo1} alt="Logo" style={{height: 32}} />
        </header>
    )

}
export default Header;
