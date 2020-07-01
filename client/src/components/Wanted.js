import React, { useState } from 'react';

function Wanted(props) {
  // function selectProject(e){
  // }

  const [disabled, setDisabled] = useState(false);

  function add(e) {
    setDisabled(!disabled);
    props.addProject(e, props.w.wanted.NAME);
  }

  function remove(e) {
    setDisabled(!disabled);
    props.removeProject(e, props.w.wanted.NAME);
  }

  return (
    <div className="wanted">
      <div className="active">
        {props.w.wanted.ACTIVE === 'Y' ? 'dossier ouvert' : 'dossier clos'}
      </div>
      <div className="wanted-head">
        <div>client</div>
        <div>{props.w.wanted.CUSTOMER}</div>
        <div>projet</div>
        <div>{props.w.wanted.NAME}</div>
      </div>

      <div
        className="wanted-buttons"
        style={props.buttonVisible ? { display: 'flex' } : { display: 'none' }}
      >
        <button disabled={disabled} onClick={add}>
          Ajouter
        </button>
        <button disabled={!disabled} onClick={remove}>
          Enlever
        </button>
      </div>
    </div>
  );
}

export default Wanted;

// return (
//   <div
//     className="wanted-wrapper"
//   >
//     <div className="wanted-head">
//       <div>{props.speaks}</div>
//       <div>{new Date(props.timeStamp).toLocaleTimeString()}</div>
//     </div>

//     <div className="wanted-message">{props.text}</div>
//   </div>
// );
// }
