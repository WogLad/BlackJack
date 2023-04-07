import { Card } from "./App";

const symbolNameToImage: any = {h: "♥️", d: "♦️", s: "♠️", c: "♣️"};

export const CardComponent: React.FC<Card> = ({digit, symbol}) => {
  return (
    <div style={{
      fontWeight: 'bolder',
      background: 'white',
      color: 'black',
      width: '250px',
      height: '350px',
      borderRadius: '0.75rem',
      margin: "20px",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
    }}>
      <div style={{
        width: "93%",
        height: "95%",
        border: "3px dashed black",
        borderRadius: "0.75rem",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          fontSize: "5rem",
          color: ((symbol == "h" || symbol == "d") ? "#ff0000" : "#000000")
        }}>
          {digit.toUpperCase()}
        </div>
        <span className="material-symbols-outlined" style={{fontSize: "5rem"}}>
          {symbolNameToImage[symbol]}
        </span>
      </div>
    </div>
  );
}