import React, { useEffect, useState } from "react";
import {
  ref,
  set,
  onValue,
  get,
  child,
  update,
  push,
  remove,
  refFromURL,
  increment,
} from "firebase/database";
import { db } from "./component/config";
import { Spinner } from "react-bootstrap";
import "./App.css";

var InfoIsComplet,
  PlayerFound,
  Turn,
  MyTurn,
  Opponent,
  CaseData,
  Class_Case1_1 = "Case1_1 ",
  Class_Case1_2 = "Case1_2 ",
  Class_Case1_3 = "Case1_3 ",
  Class_Case2_1 = "Case2_1 ",
  Class_Case2_2 = "Case2_2 ",
  Class_Case2_3 = "Case2_3 ",
  Class_Case3_1 = "Case3_1 ",
  Class_Case3_2 = "Case3_2 ",
  Class_Case3_3 = "Case3_3 ",
  NumberOfMovesToPlay = 0,
  Winer = null;

function App() {
  const [playCode, setPlayCode] = useState("");
  const [playerName, setplayerName] = useState("");
  const [playerNum, setplayerNum] = useState(1);
  var [StatusText, setStatusText] = useState();
  var [GameStart, setGameStart] = useState(false);
  var [GameFinishP1, setGameFinishP1] = useState(false);
  var [GameFinishP2, setGameFinishP2] = useState(false);
  var [ShowTurn, setShowTurn] = useState({ name: "", number: 0 });
  // var [MyTurn, setMyTurn] = useState()
  // var   [TurnTo, setTurnTo] = useState(); 

  // var GameStart = false;
  // var InfoIsComplet, Opponent, PlayerFound,Turn,MyTurn;

  document.onload = Initial();

  function Initial() {
    // Initialse au chargement du site la Phrase au milieux à l'état 1 donc pas d'info Rentré
  	useEffect(()=>{
      StatusOpponent(1);
      setGameFinishP1(true)
      setGameFinishP2(true)
      // console.log(`Gamed Stat is : ${GameStart}`);
      
      if(localStorage.playCode && localStorage.playerName !== undefined){
        setPlayCode(localStorage.playCode)
        setplayerName(localStorage.playerName)
        // setplayerNum(localStorage.playerNum)
      }else{
        console.log("You never play ;)")
      }
    // alert("Yeap")
  }, [])
  };

  // const [currentPlayer, setCurrentPlayer] = useState("");
  // const [gameBoard, setGameBoard] = useState(Array(9).fill("free"));
  // const [gamePlayed, setGamePlayed] = useState(0);
  function SubmitForm(e){
    e.preventDefault();
    TakeInfo(playCode, playerName, playerNum)
  }
  function TakeInfo(playCode, playerName, playerNum) {
    // Renvois Les info de jeux à la fonction FoudOpponent() après les avoir vérifier (Non Vide) //

    if (playCode || playerName || playerNum !== "") {
      if (playCode === "") {
        alert("Please enter a Game Code!");
      }
      if (playerName === "") {
        alert("Please enter a Name!");
      }
      if (playerNum === "") {
        alert("Please enter a Player Number!");
      }
    }
    if (playCode !== "" && playerName !== "" && playerNum !== "" && (playerNum === 1 | playerNum === 2)) {
      console.log(
        `Your Game Code is "${playCode}" and your name is "${playerName}" and your Player Number is "${playerNum}"`
      );
      localStorage["playCode"] = playCode;
      localStorage["playerName"] = playerName;
      // localStorage["playerNum"] = playerNum;
      FoundOpponent([playCode, playerName, playerNum]);
    }else{
      alert("There was a problem lord of desire please check all fields of the form.")
    }
  }

  function FoundOpponent(Info) {
    // Récupération des info //
    const TramGameToPlay = Info;
    // localStorage['TramInfoPLay'] = TramGameToPlay;
    // console.log(TramGameToPlay);

    // ## lecture du CTP vérifer si il existe
    get(ref(db, `Games/CodeToPlay_${TramGameToPlay[0]}/`))
      .then((snapshot) => {
        // # Si oui{
        if (snapshot.exists()) {
          // ## vérif si il y a une RequestPlayer ## //
          get(ref(db, `Games/CodeToPlay_${TramGameToPlay[0]}/RequestPlayer`))
            .then((snapshot) => {
              // # Si oui{
              if (snapshot.exists()) {
                const response = snapshot.val();
                if (playerName === response.playerName) {
                  alert("your Name is allrady Used, pleas change it !");
                }
                if (playerNum === response.playerNum) {
                  alert("your Player Number is allrady Used, pleas change it !");
                }
                if (
                  playerName !== response.playerName &&
                  playerNum !== response.playerNum
                ) {
                  console.log(
                    `you are J2 and J1 is foud ! `
                  );
                  InfoIsComplet = true;
                  // ### Envoyer une alerte au Requester ### //

                  // ### Update Needplayer to false ### //
                  const updates = {};
                  updates[
                    `Games/CodeToPlay_${TramGameToPlay[0]}/NeedPlayer/`
                  ] = false;
                  update(ref(db), updates);

                  // ### Crée une GameInfo Dans le CTP ### //
                  if (response.playerNum === 1) {
                    set(
                      ref(db, `Games/CodeToPlay_${TramGameToPlay[0]}/GameInfo`),
                      {
                        playersNames: {
                          player1: response.playerName,
                          player2: playerName,
                        },
                        turnIsTo: {
                          name: response.playerName,
                          number: 1,
                        },
                        gameState: {
                          0: [0, true],
                          1: [0, true],
                          2: [0, true],
                          3: [0, true],
                          4: [0, true],
                          5: [0, true],
                          6: [0, true],
                          7: [0, true],
                          8: [0, true],
                        },
                        GameStart: true,
                        ValueInfo:{
                          GameFinish: false,
                          NumberOfMovesToPlay : 0
                        }
                      }
                    );
                  } else {
                    set(
                      // Envois à la BDD les parametre initialisation d'un nouveaux Jeux
                      ref(db, `Games/CodeToPlay_${TramGameToPlay[0]}/GameInfo`),
                      {
                        playersNames: {
                          player1: playerName,
                          player2: response.playerName,
                        },
                        turnIsTo: {
                          name: playerName,
                          number: 1,
                        },
                        gameState: {
                          0: [0, true],
                          1: [0, true],
                          2: [0, true],
                          3: [0, true],
                          4: [0, true],
                          5: [0, true],
                          6: [0, true],
                          7: [0, true],
                          8: [0, true],
                        },
                        GameStart: true,
                        ValueInfo:{
                          GameFinish: false,
                          NumberOfMovesToPlay : 0
                        }
                      }
                    );
                  }

                  // ### Supprimer la Request ### //
                  remove(
                    ref(
                      db,
                      `Games/CodeToPlay_${TramGameToPlay[0]}/RequestPlayer`
                    )
                  );

                  // Envoyer les attente d'addvairsaire //
                  WaiteOpponent(playCode);
                }

                // # Si non{
              } else {
                // ### Alerter le joueur qu'une partie est déjà en cours sur le CTP envoyer ### //
                console.log(
                  `a game is already in progress with this Game Code : (${playCode})`
                );
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
        if (
          !snapshot.exists() ||
          (snapshot.val().NeedPlayer === true) & InfoIsComplet
        ) {
          // ### écrire la request et attendre un joueur ### //
          set(ref(db, `Games/CodeToPlay_${TramGameToPlay[0]}`), {
            NeedPlayer: true,
            RequestPlayer: {
              playerName: TramGameToPlay[1],
              playerNum: Number(TramGameToPlay[2]),
            },
          })
            .then(() => {
              WaiteOpponent(playCode);
              console.log("Succses Send ;)");
              StatusOpponent(2);

              document.querySelector("#Code").disabled = true;
              document.querySelector("#Name").disabled = true;
              document.querySelector("#Num").disabled = true;
              document.querySelector("#ConfBtn").classList.add("disabled");
            })
            .catch((error) => {
              console.log(error);
            });
          console.log("No data available before");
        }
        if (snapshot.exists() && snapshot.val().NeedPlayer === false) {
          alert("This game is complet !");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function WaiteOpponent(playCode) {
    // Attendre un Advairsaire
    const Path = ref(db, `Games/CodeToPlay_${playCode}/GameInfo/playersNames`);
    onValue(Path, (snapshot) => {
      // Code éxecuter des deux coté lors d'une connection entre deux joueur :) //
      if (snapshot.exists()) {
      var Data = snapshot.val();
        if (playerNum === 1) {
          Opponent = Data.player2;
        } else {
          Opponent = Data.player1;
        }

        console.log(
          `Hey ${playerName} we foud your opponent, is -- ${Opponent} -- You can play now !`
        );

        // Fonction D'initialisation du jeux //
        PlayerFound = true;
        setGameStart(true);
        setGameFinishP1(false)
        setGameFinishP2(false)
        StatusOpponent(3);
        TakeTurnToPlay();
        GameState();
        console.log(`Party Launch ! (GameStarted = ${GameStart} )`);

        // Empéche de Modif les info de jeux //
        if (PlayerFound) {
          document.querySelector("#Code").disabled = true;
          document.querySelector("#Name").disabled = true;
          document.querySelector("#Num").disabled = true;
          document.querySelector("#ConfBtn").classList.add("disabled");
          StatusOpponent(4);
        }
        // ${GameInfo.turnIsTo}
      }
    });
  }

  function TakeTurnToPlay() {
    const Path = ref(db, `Games/CodeToPlay_${playCode}/GameInfo/turnIsTo`);
    onValue(Path, (snapshot) => {
      // Code exécuter à chaque changement de `Games/CodeToPlay_${playCode}/GameInfo/turnIsTo` //
      if (snapshot.exists()) {
        var dataTurn = snapshot.val();
        Turn = [dataTurn.name, dataTurn.number];
        setShowTurn({ name: dataTurn.name, number: dataTurn.number });

        // Teste si le tour sur la BDD correspond à Numéraux du joueur //
        if (Turn[1] === playerNum) {
          // Si oui C'est Bien son tour //
          MyTurn = true;
        } else {
          // Si Non Ce n'est pas encore sont Tour //
          MyTurn = false;
        }
      }
    });
  }

  function TurnToPlay() {
    // Affiche à qui c'est de jouer //
    return (
      <h2 id="info" className="my-3 mt-5">
        It is turn to
        <b>
          <span id="turn">
            {" "}
            {ShowTurn.name}
          </span>
        </b>
      </h2>
    );
  }

  function InfoText1() {
    // Affiche les instruction que le joueur doit suivre //
    return (
      <div>
        <h3>
          Please <b>{playerName}</b> enter info to connect with your friend.
        </h3>
      </div>
    );
  }

  function InfoText2() {
    // Affiche les instruction que le joueur doit suivre //
    return (
      <h3 className=" d-flex flex-column align-items-center justify-content-center align-content-center animate__animated animate__rotateIn">
        <span className="pb-3">
          Hi, <b>{playerName}</b> your opponent search you please waite him.
        </span>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </h3>
    );
  }

  function InfoText3() {
    // Affiche les instruction que le joueur doit suivre //
    return (
      <div>
        <h3 id="InfoText3" className="animate__animated animate__heartBeat">
          Hey, <b>{playerName}</b> we foud your opponent, it's <b>{Opponent}</b> .
        </h3>
      </div>
    );
  }

  function InfoText5() {
    // Affiche le Vainqueur ! //

    // Récuper le nom du vainqueur
    // get(ref(db, `Games/CodeToPlay_${playCode}/GameInfo/gameState`)).then((snapshot) => {
      
    // })

    // Qui est le vainqueur ! //
    setGameFinishP1(true)
    if(Winer === playerNum){
      return (
        <div>
          <h3 id="InfoText3" className="animate__animated animate__infinite animate__pulse">
            Well done, <b className="InfoWiner Winer">{playerName}</b> you win against <b>{Opponent}</b>.
          </h3>
        </div>
      );
    }
    if(Winer !== playerNum && Winer !== ' no one '){
      return (
        <div>
          <h3 id="InfoText3" className="animate__animated animate__infinite animate__pulse">
            Sorry, <b className="InfoWiner Losser">{playerName}</b> you lost to <b>{Opponent}</b>.
          </h3>
        </div>
      );
    }else{
      return (
        <div>
          <h3 id="InfoText3" className="animate__animated animate__swing">
            GGs, <b>{playerName}</b> and <b>{Opponent}</b> good game but there is a draw !
          </h3>
        </div>
      );
    }


  }

  function StatusOpponent(StatutNum) {
    // Vérifi le État du Jeux de jeux //
    if (StatutNum === 1) {
      setStatusText(<InfoText1 />);
    }
    // Vérifi le État du Jeux de jeux //
    if (StatutNum === 2) {
      setStatusText(<InfoText2 />);
    }
    // Vérifi le État du Jeux de jeux //
    if (StatutNum === 3) {
      setStatusText(<InfoText3 />);
    }
    if (StatutNum === 4) {
      document
        .querySelector(".InfoCard")
        .classList.add(
          "animate__delay-4s",
          "animate__animated",
          "animate__zoomOutDown"
        );
    }
    // Vérifi le État du Jeux de jeux //
    if (StatutNum === 5) {
      InfoText5()
      setStatusText(<InfoText5 />);      

      document.querySelector(".InfoCard")
      .classList.remove(
        "animate__delay-4s",
        "animate__animated",
        "animate__zoomOutDown"
      );

      document.querySelector(".InfoCard")
      .classList.add(
        "animate__animated",
        "animate__fadeInUp",
        "animate__fast"
      );
    }
  }

  function InfoCard() {
    return (
      <div className="">
        opponent Info :
        <div className=" border border-2 p-4 m-2 rounded border-light">
          {StatusText}
        </div>
      </div>
    );
  }

  function TablePlay() {
    return (
      <table id="finished" className="my-3">
        <tbody>
          <tr>
            <td
              id="1"
              onClick={() => Game(0)}
              className="p-4 border-4 border-light"
            >
              <div id="Case1_1" className={Class_Case1_1}></div>
            </td>
            <td
              id="2"
              onClick={() => Game(1)}
              className="p-4 border-4 border-light border-end border-start"
            >
              <div id="Case1_2" className={Class_Case1_2}></div>
            </td>
            <td
              id="3"
              onClick={() => Game(2)}
              className="p-4 border-4 border-light"
            >
              <div id="Case1_3" className={Class_Case1_3}></div>
            </td>
          </tr>
          <tr>
            <td
              id="4"
              onClick={() => Game(3)}
              className="p-4 border-4 border-light border-top border-bottom"
            >
              <div id="Case2_1" className={Class_Case2_1}></div>
            </td>
            <td
              id="5"
              onClick={() => Game(4)}
              className="p-4 border-4 border-light border"
            >
              <div id="Case2_2" className={Class_Case2_2}></div>
            </td>
            <td
              id="6"
              onClick={() => Game(5)}
              className="p-4 border-4 border-light border-top border-bottom"
            >
              <div id="Case2_3" className={Class_Case2_3}></div>
            </td>
          </tr>
          <tr>
            <td
              id="7"
              onClick={() => Game(6)}
              className="p-4 border-4 border-light"
            >
              <div id="Case3_1" className={Class_Case3_1}></div>
            </td>
            <td
              id="8"
              onClick={() => Game(7)}
              className="p-4 border-4 border-light border-end border-start"
            >
              <div id="Case3_2" className={Class_Case3_2}></div>
            </td>
            <td
              id="9"
              onClick={() => Game(8)}
              className="p-4 border-4 border-light"
            >
              <div id="Case3_3" className={Class_Case3_3}></div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  function GameState() {
    const PathGame = ref(db, `Games/CodeToPlay_${playCode}/GameInfo/gameState`);
    onValue(PathGame, (snapshot) => {
      if(snapshot.exists()){
        CaseData = snapshot.val();
        console.log("Done", CaseData);

        var IdShape = 0;

        // Afficher les Forme Correspondant aux Num donc J1 = Croix et J2 = Roud //
        CaseData.forEach((caseTo) => {
          // console.log(caseTo[0])
          // console.log(IdShape)
          if (caseTo[0] === 1) {
            if (IdShape === 0) {
              Class_Case1_1 += " Cross ";
            }
            if (IdShape === 1) {
              Class_Case1_2 += " Cross ";
            }
            if (IdShape === 2) {
              Class_Case1_3 += " Cross ";
            }
            if (IdShape === 3) {
              Class_Case2_1 += " Cross ";
            }
            if (IdShape === 4) {
              Class_Case2_2 += " Cross ";
            }
            if (IdShape === 5) {
              Class_Case2_3 += " Cross ";
            }
            if (IdShape === 6) {
              Class_Case3_1 += " Cross ";
            }
            if (IdShape === 7) {
              Class_Case3_2 += " Cross ";
            }
            if (IdShape === 8) {
              Class_Case3_3 += " Cross ";
            }
          }
          if (caseTo[0] === 2) {
            if (IdShape === 0) {
              Class_Case1_1 += " Circle ";
            }
            if (IdShape === 1) {
              Class_Case1_2 += " Circle ";
            }
            if (IdShape === 2) {
              Class_Case1_3 += " Circle ";
            }
            if (IdShape === 3) {
              Class_Case2_1 += " Circle ";
            }
            if (IdShape === 4) {
              Class_Case2_2 += " Circle ";
            }
            if (IdShape === 5) {
              Class_Case2_3 += " Circle ";
            }
            if (IdShape === 6) {
              Class_Case3_1 += " Circle ";
            }
            if (IdShape === 7) {
              Class_Case3_2 += " Circle ";
            }
            if (IdShape === 8) {
              Class_Case3_3 += " Circle ";
            }
          }
          IdShape++;
        });     

        var CheckWin1 = CaseData[0][0] * CaseData[1][0] * CaseData[2][0];
        var CheckWin2 = CaseData[3][0] * CaseData[4][0] * CaseData[5][0];
        var CheckWin3 = CaseData[6][0] * CaseData[7][0] * CaseData[8][0];
        var CheckWin4 = CaseData[0][0] * CaseData[4][0] * CaseData[8][0];
        var CheckWin5 = CaseData[2][0] * CaseData[4][0] * CaseData[6][0];
        var CheckWin6 = CaseData[0][0] * CaseData[3][0] * CaseData[6][0];
        var CheckWin7 = CaseData[1][0] * CaseData[4][0] * CaseData[7][0];
        var CheckWin8 = CaseData[2][0] * CaseData[5][0] * CaseData[8][0];

        var TabCheckWin = [CheckWin1,CheckWin2,CheckWin3,CheckWin4,CheckWin5,CheckWin6,CheckWin7,CheckWin8];

        TabCheckWin.forEach(check => {
          if(check === 1){
            Winer = 1;
            StatusOpponent(5);

            const updates = {}
            updates[`Games/CodeToPlay_${playCode}/GameInfo/ValueInfo/GameFinish`] = true;
            update(ref(db), updates)
            
            RemoveTable();
          }
          if(check === 8){
            Winer = 2;
            StatusOpponent(5);

            const updates = {};
            updates[`Games/CodeToPlay_${playCode}/GameInfo/ValueInfo/GameFinish`] = true;
            update(ref(db), updates)
            
            RemoveTable();
          }
        });

        // Comptage de nombre de case jouer //
        NumberOfMovesToPlay = 0
        CaseData.forEach(element => {
          if(element[1] === false){
            NumberOfMovesToPlay ++
          }
        });
        console.log(NumberOfMovesToPlay);

        console.log(Winer)
        if(NumberOfMovesToPlay === 9 && Winer !== 1 && Winer !== 2 ){
          console.log(Winer)
            Winer = ' no one ';
            StatusOpponent(5);

            const updates = {};
            updates[`Games/CodeToPlay_${playCode}/GameInfo/ValueInfo/GameFinish`] = true;
            update(ref(db), updates)

            RemoveTable();
        }

        get(ref(db, `Games/CodeToPlay_${playCode}/GameInfo/gameState`)).then((snapshot) => {
          if(snapshot.exists()){
            const updates = {};
            updates[`Games/CodeToPlay_${playCode}/GameInfo/ValueInfo/NumberOfMovesToPlay`] = NumberOfMovesToPlay;
            update(ref(db), updates);
          }
        })
      }
    });
  }

  // function GameIsDraw(){
  //   const PathGame = ref(db, `Games/CodeToPlay_${playCode}/GameInfo/ValueInfo`);
  //   onValue(PathGame, (snapshot) => {
  //     if(snapshot.exists()){
  //       let Data = snapshot.val()

  //       if(Data.NumberOfMovesToPlay === 9){
  //         setGameFinish(true)
  //         StatusOpponent(5);
  //       }
  //       // ValueInfo:{
  //       //   GameFinish: false,
  //       //   NumberOfMovesToPlay : 0
  //       // }
  //     }
  //   });
  // }

  const Game = (caseId) => {
    console.log("Case is : ", CaseData[caseId][1]);

    if(Winer === null){
      if (CaseData[Number(caseId)][1] === true) {
        if (MyTurn) {
          const updates = {};
          updates[`Games/CodeToPlay_${playCode}/GameInfo/gameState/${caseId}/0`] =
            playerNum;
          updates[
            `Games/CodeToPlay_${playCode}/GameInfo/gameState/${caseId}/1`
          ] = false;
          update(ref(db), updates);
        }
        if (!MyTurn) {
        }
  
        console.log(`Playnum = ${playerNum} `);
        if (!MyTurn) {
          alert("Wait it's not your turn!");
        }
        if (MyTurn) {
          if (playerNum === 1) {
            console.log(Opponent);
            const updates = {};
            updates[`Games/CodeToPlay_${playCode}/GameInfo/turnIsTo/name`] = Opponent;
            updates[`Games/CodeToPlay_${playCode}/GameInfo/turnIsTo/number`] = 2;
            update(ref(db), updates);
          } else {
            console.log(Opponent);
            const updates = {};
            updates[`Games/CodeToPlay_${playCode}/GameInfo/turnIsTo/name`] = Opponent;
            updates[`Games/CodeToPlay_${playCode}/GameInfo/turnIsTo/number`] = 1;
            update(ref(db), updates);
          }
        }
      } else {
        alert(
          `No sorry ${playerName}, you cannot replay a space already played!`
        );
      }
    }
  };

  const Restart = () => {
    setGameFinishP1(true)
    setGameFinishP2(true)
    window.location.reload()
  };

  const RemoveTable = () => {
    remove(
      ref(
        db,
        `Games/CodeToPlay_${playCode}/`
      )
    );
  }

  const ResetDating = () => {
    if(localStorage.playCode && localStorage.playerName !== undefined){
      localStorage.removeItem("playCode");
      localStorage.removeItem("playerName");

      window.location.reload()
    }else{
      console.log("Nothing to delete ;) ")
    }
  };

  return (
    <div>
      <header className="text-center p-4 font1">
        <h1 className="Titel">My first morpion</h1>
      </header>

      <section className="p-5 d-flex justify-content-center flex-column align-items-center">
        <h3>Please enter your game info:</h3>

        <form onSubmit={SubmitForm} className="d-flex justify-content-center flex-column align-content-center align-items-center">
          <div className="my-4 d-flex flex-wrap justify-content-center">
          <div className="d-flex align-items-center m-4 flex-wrap flex-column justify-content-center">
            <span className="mx-4 my-2">
              Game code is « <b>{playCode}</b> »
            </span>
            <span className="d-flex">
              <div id="t">
                <input
                  id="Code"
                  className="rounded-2 px-2 border border-2 border-dark"
                  type="text"
                  placeholder="Enter your game code"
                  aria-label="default input example"
                  value={playCode}
                  onChange={(e) => setPlayCode(e.target.value)}
                />
              </div>
            </span>
          </div>

          <div className="d-flex align-items-center m-4 flex-wrap flex-column justify-content-center">
            <span className="mx-4 my-2">
              Enter your name please <b>{playerName}</b> :
            </span>
            <span className="d-flex">
              <div id="t">
                <input
                  id="Name"
                  className="rounded-2 px-2 border border-2 border-dark"
                  type="text"
                  placeholder="Enter your name"
                  aria-label="default input example"
                  value={playerName}
                  onChange={(e) => setplayerName(e.target.value)}
                />
              </div>
            </span>
          </div>
          <div className="d-flex flex-fill justify-content-center align-items-center align-self-center">
            <h4>
              <b>which player are you 1 or 2 ?</b>
            </h4>
            <div className="d-flex align-items-center m-4 flex-wrap flex-column justify-content-center">
              <input
                id="Num"
                className="rounded-2 px-2 border border-2 border-dark"
                type="number"
                value={playerNum}
                onChange={(e) => setplayerNum(Number(e.target.value))}
              />
            </div>
          </div>
          </div>
        <button
          type="submit"
          className="btn btn-primary mx-3 my-2"
          id="ConfBtn"
          >
          <b className="m-1">Confirm</b>
        </button>
        </form>
        <div className="InfoCard">
          <InfoCard />
        </div>
        {/* <span
          type="submit"
          className="btn btn-danger mx-3 my-2"
          onClick={() => TakeInfo(playCode = localStorage.TramGameToPlay[0], playerName = localStorage.TramGameToPlay, playerNum[1] = localStorage.TramGameToPlay[2])}
        >

          <b className="m-1 ">Restore</b>
        </span> */}

        {!GameFinishP1 && <TurnToPlay />}
        <br />
        <br />
        {!GameFinishP2 && <TablePlay />}
        <div className="d-flex flex-row justify-content-center align-items-center align-content-center">
          <button
            id="Restart"
            onClick={() => Restart()}
            className="btn my-4 btn-outline-light"
          >
            Restart
          </button>
          <button
            type="submit"
            className="btn btn-danger mx-3"
            onClick={() => ResetDating()}
          >
            Reset saved data
          </button>
        </div>
        <div id="HistoryScore" className="my-3 text-light">
          {/* <b>
  il y a actuelement ${GamePlayed} qui on été jouer, les 3 meuilleurs sont : <br>  
  <ul>
    <div id="HistoryGame"></div>
  </ul>
</b> */}
        </div>
      </section>
      <footer className="d-flex justify-content-center mt-3">
        <b className="text-center text-light m-2">
          © 2023 Copyright by New-webTech (Ahmad Jaber)
        </b>
      </footer>
    </div>
  );
}

export default App;