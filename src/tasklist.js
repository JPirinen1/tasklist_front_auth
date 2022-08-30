import { useState, useEffect } from "react";



function Tasklist() {
  const [taskText, setTaskText] = useState("");
  const [modText, setModText] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks()
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const task = {
      text: taskText,
      checked: false,
      modify: false
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    };
    fetch('https://tasklistapim.azure-api.net/tasklistfunction111/HttpTrigger2?subscription-key=9b31f930a78e43cc93303920fa31bd20', requestOptions)
        .then(response => response.json())
        .then(data => setTasks(tasks.concat(data)));

    setTaskText("")
  }

  const handleDelete = ( item) => {
    const newArray = tasks.filter((task) => task.text !== item.text)
    setTasks(newArray)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id })
    };
    fetch('https://tasklistapim.azure-api.net/tasklistfunction111/HttpTrigger4?subscription-key=9b31f930a78e43cc93303920fa31bd20', requestOptions)

    
    
  }
  const startModify = (item) => {
    const newArray = tasks.map((task) => {
      if(task.text === item.text) {
        task.modify = true
        return task
      }
      else {
        return task
      }
    })
    setModText(item.text)
    setTasks(newArray)
  }
  const handleModify = (item) => {
    const newArray = tasks.map((task) => {
      if(task.modify) {
        task.text = modText
        task.modify = false
        return task
      }
      else {
        return task
      }
    })

    item.text = modText
    item.modify = false

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };
    fetch('https://tasklistapim.azure-api.net/tasklistfunction111/HttpTrigger5?subscription-key=9b31f930a78e43cc93303920fa31bd20', requestOptions)

    setTasks(newArray)
  }
  const handleCheck = (item) => {
    const newArray = tasks.map((task) => {
      if(task.text === item.text) {
        task.checked = !task.checked
        return task
      }
      else {
        return task
      }
    })


    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };
    fetch('https://tasklistapim.azure-api.net/tasklistfunction111/HttpTrigger5?subscription-key=9b31f930a78e43cc93303920fa31bd20', requestOptions)

    setTasks(newArray)
    console.log(newArray)
  }

  const getTasks = () => {
    fetch('https://tasklistapim.azure-api.net/tasklistfunction111/HttpTrigger3?subscription-key=9b31f930a78e43cc93303920fa31bd20')
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setTasks(data)
        });
  }


  return (
    <div className="App">
      <h1>TO-DO_LIST</h1>


      <form onSubmit={handleSubmit}>
      <label>Enter new task:
        <input 
          type="text" 
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
      </label>
      
      <input type="submit" />
      </form>


      <div>
        <ol>
          {tasks.map((item, i) => 
            <li key={i}>
              {item.modify ? 
                <form onSubmit={() => handleModify(item)}>
                  <input 
                    type="text"
                    value={modText}
                    onChange={(e) => setModText(e.target.value)}>
                    
                  </input>
                  <input type="submit" />
                </form>
                 :
                <p>{item.text}</p>}
              
              <button onClick={() => handleDelete(item)}>Delete</button>
              <button onClick={() => startModify(item)}>Modify</button>
              <label>
              <input 
                type="checkbox"
                value={item.checked}
                checked={item.checked}
                onChange={() => handleCheck(item)} />
                Done
              </label>
            </li>)}
        </ol>
        
      </div>
    </div>
  );
}

export default Tasklist;
