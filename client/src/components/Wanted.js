import React from 'react';

function Wanted(props) {
  // function selectProject(e){

  // }

  return (
    <div className="wanted">
      <div>client: {props.w.wanted.CUSTOMER}</div>
      <div>projet: {props.w.wanted.NAME}</div>
      <div>
        {props.w.wanted.ACTIVE === 'Y' ? 'dossier ouvert' : 'dossier clos'}
      </div>
      <button onClick={(e) => props.addProject(e, props.w.wanted.NAME)}>
        Ajouter
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
