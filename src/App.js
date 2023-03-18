import React, { useState, useRef } from 'react';
import './App.css';
import CustomDialog from './Components/CustomDialog';

function App() {
  const [tailNumber, setTailNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [aircraftSeries, setAircraftSeries] = useState('');
  const [engineManufacturer, setEngineManufacturer] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isChooseFileDialogOpen, setIsChooseFileDialogOpen] = useState(false);
  const [isUploadCompleteDialogOpen, setIsUploadCompleteDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const openChooseFileDialog = () => {
    setIsChooseFileDialogOpen(true);
  };

  const closeChooseFileDialog = () => {
    setIsChooseFileDialogOpen(false);
  };

  const openUploadCompleteDialog = () => {
    setIsUploadCompleteDialogOpen(true);
  };

  const closeUploadCompleteDialog = () => {
    setIsUploadCompleteDialogOpen(false);
  };


  const customFetch = async (url, options, onUploadProgress) => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.open(options.method, url);

      if (onUploadProgress) {
        xhr.upload.onprogress = onUploadProgress;
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        }
      };

      xhr.onerror = () => {
        reject(new Error(xhr.statusText));
      };

      xhr.send(options.body);
    });
  };

  const handleLookupButtonClick = (e) => {
    e.preventDefault();
    if( tailNumber === "12321" ){
      setManufacturer('Boeing')
      setAircraftSeries('737')
      setEngineManufacturer('rollsRoyce')
      alert(`Aircraft record found for tail number: ${tailNumber}`);
      return
    }
    alert(`No aircraft record found for tail number: ${tailNumber}`);
  };

  const handleFileInputChange = (event) => {
    // Add your file handling logic here
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit")
    e.preventDefault();

    const formData = new FormData();
    formData.append('tailNumber', tailNumber);
    formData.append('manufacturer', manufacturer);
    formData.append('aircraftSeries', aircraftSeries);
    formData.append('engineManufacturer', engineManufacturer);
    formData.append('file', file);

    if (tailNumber === '' || manufacturer === '' || aircraftSeries === '' || engineManufacturer === '' ||  file === null){
      openChooseFileDialog();
      return
    }

    const response = await customFetch('http://localhost:3001/submit', {
      method: 'POST',
      body: formData,
    }, (event) => {
      const percent = Math.round((event.loaded / event.total) * 100);
      setProgress(percent);
    });

    // comment
    if (response) {
      setTailNumber('');
      setManufacturer('');
      setAircraftSeries('');
      setEngineManufacturer('');
      setFile(null);
      setProgress(0);
      openUploadCompleteDialog();
    }
  };

  return (
    <div className="App">
      <h1>UPLOAD FILE</h1>
      <div className="form-container">
      <p className="instruction">
        Please provide the aircraft tail number for lookup, or complete the other fields below, before uploading the data file.
      </p>
      <form>

        <label htmlFor="tailNumber">Tail Number</label>
        <div className="tailnumbercontainer">
        
          <input
            type="text"
            id="tailNumber"
            value={tailNumber}
            onChange={(e) => setTailNumber(e.target.value)}
            required
          />
          <button className="button-lookup" onClick={(e) => handleLookupButtonClick(e)}>LOOKUP</button>
        </div>

        <label htmlFor="manufacturer">Manufacturer</label>
        <select
          id="manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          required
        >
          <option value="">Select a manufacturer</option>
          <option value="Boeing">Boeing</option>
          <option value="Airbus">Airbus</option>
          <option value="Cessna">Cessna</option>
        </select>

        <label htmlFor="aircraftSeries">Aircraft Series</label>
        <select
          id="aircraftSeries"
          value={aircraftSeries}
          onChange={(e) => setAircraftSeries(e.target.value)}
          required
        >
          <option value="">Select an aircraft series</option>
          <option value="737">737</option>
          <option value="a320">A320</option>
          <option value="citation">Citation</option>
        </select>

        <label htmlFor="engineManufacturer">Engine Manufacturer</label>
        <select
          id="engineManufacturer"
          value={engineManufacturer}
          onChange={(e) => setEngineManufacturer(e.target.value)}
          required
        >
         
      <option value="">Select an engine manufacturer</option>
      <option value="ge">General Electric</option>
      <option value="rollsRoyce">Rolls-Royce</option>
      <option value="prattWhitney">Pratt & Whitney</option>
    </select>

    
    <label htmlFor="file">File Upload</label>
    
    <input
      type="file"
      id="file"
      ref={fileInputRef}
      onChange={handleFileInputChange}
      style={{ display: 'none' }}
      required/>

    <div className="filelabelcontainer">
      <button className="custom-file-upload" onClick={(e) => handleFileButtonClick(e)}>
      CHOOSE FILE
      </button>

      <div className="filelabeladjust">
        <span className="file-label">
            {file ? file.name : 'No file selected'}
        </span>
      </div>
    </div>
    

    <div className="progress">
      <div className="progress-bar" style={{ width: `${progress}%`,  backgroundColor: '#ff000a' }}>
        {progress > 0 && `${progress}%`}
      </div>
    </div>

    <button onClick={(e) => handleSubmit(e)}>UPLOAD FILE</button>
  </form>
  <CustomDialog
      isOpen={isChooseFileDialogOpen}
      onClose={closeChooseFileDialog}
      title="ERROR">
      <p>Please complete all fields and choose a file for upload.</p>
  </CustomDialog>

  <CustomDialog
      isOpen={isUploadCompleteDialogOpen}
      onClose={closeUploadCompleteDialog}
      title="UPLOAD COMPLETE">
      <p>The file has been succesfully uploaded</p>
  </CustomDialog>

  </div>
</div>
);
}

export default App;