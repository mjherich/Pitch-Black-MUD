import React, { useEffect, useRef } from 'react'

// import sprite from './dawnblocker_ortho.png'
import player1 from './player1.png'
import player2 from './player2.png'
import player3 from './player3.png'
import player4 from './player4.png'
import player5 from './player5.png'

const sprite = require('./dawnblocker_ortho.png')

const room_types = {
    1: {
        type: "path",
        sx: 153,
        sy: 267,
    },
    2: {
        type: "Treasure Room",
        sx: 153,
        sy: 236,
    },
    3: {
        type: "Monster Room",
        sx: 170,
        sy: 236,
    },
    4: {
        type: "Key Room",
        sx: 170,
        sy: 267,
    },
    5: {
        type: "Lock Room",
        sx: 136,
        sy: 261,
    }
}

export default function Dungeon(props) {
    const canvasRef = useRef(null)
    const spriteRef = useRef(null)

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        spriteRef.current.onload = () => {
            // Loop over map
            for (let c = props.map.cols - 1; c >= 0; c--) {
                for (let r = 0; r < props.map.rows; r++) {
                    let tile = props.map.getTile(c, r);
                    if (tile !== 0) { // 0 => empty tile
                        ctx.drawImage(
                            spriteRef.current, // image
                            room_types[tile].sx, // source x
                            room_types[tile].sy, // source y
                            15, // source width
                            15, // source height
                            c * props.map.tileWidth, // target x
                            r * props.map.tileHeight, // target y
                            props.map.tileWidth, // target width
                            props.map.tileHeight // target height
                        );
                    }
                }
            }
        }
        if (props.lavaMode) {
            ctx.fillStyle = '#000000';
            ctx.shadowColor = '#f85800';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = -8;
            ctx.shadowOffsetY = 8;
            ctx.fill();
        }
    }, [props.map, props.lavaMode])
    
    return (
        <div className="dungeon-container">
            <div className='dungeon-canvas-container' style={{position: 'relative'}}>
                <canvas id="dungeon-canvas" ref={canvasRef} width="750" height="750"></canvas>
                <img src={player1} style={{position: 'absolute', left: props.playerLocation.x * 30 +7, top: props.playerLocation.y * 30 +5 }} alt="player" />
            </div>
            <img id="sprite-img" src={sprite} alt="dungeon sprite" ref={spriteRef} style={{ display: "none" }} />
            {/* <img id='player-img' src={playersSprite} ref={playerRef} alt='player' style={{ display: "none" }} /> */}
            
            <img src={player2} alt="player 2"/>
            <img src={player3} alt="player 3"/>
            <img src={player4} alt="player 4"/>
            <img src={player5} alt="player 5"/>
        </div>
    )
}