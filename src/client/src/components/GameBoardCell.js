import React from 'react'

export default function GameBoardCell({value, placePiece}) {
    return (
        <span onClick={placePiece} style={{border: "1px solid black", display:"flex", justifyContent:"center", alignItems:"center", cursor: "pointer"}}>
            {value}
        </span>
    )
}
