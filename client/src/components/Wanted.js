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
      <div>client: {props.w.wanted.CUSTOMER}</div>
      <div>projet: {props.w.wanted.NAME}</div>
      <div>
        {props.w.wanted.ACTIVE === 'Y' ? 'dossier ouvert' : 'dossier clos'}
      </div>
      <button
        disabled={disabled}
        onClick={add}
        style={props.buttonVisible ? { display: 'block' } : { display: 'none' }}
      >
        Ajouter
      </button>
      <button
        disabled={!disabled}
        onClick={remove}
        style={props.buttonVisible ? { display: 'block' } : { display: 'none' }}
      >
        Enlever
      </button>
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
