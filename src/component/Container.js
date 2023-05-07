import { Button, Divider, List, Select } from "antd"
import axios from "axios"
import Item from "./Item";
import { useEffect, useState } from "react";

function Container() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [amountTaskDone, setAmountTasksDone] = useState(0)
  const [isLoadingTask, setIsLoadingTask] = useState(false)
  const [isLoadingMarkDone, setIsLoadingMarkDone] = useState([])

  // Api
  const instance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/"
  })

  const getUsers = async () => {
    return (await instance.get('/users')).data
  }

  const getTasks = async (userId) => {
    return (await instance.get(`/users/${userId}/todos`)).data
  }

  const patchTask = async (taskId) => {
    return await instance.patch(`/todos/${taskId}`, {
      completed: true
    })
  }

  // main 
  useEffect(() => {
    const fetch = async () => {
      const response = await getUsers()
      setUsers(response)
    }
    fetch()
  }, [])

  const sortTask = (arg) => {
    let start = 0
    let end = arg.length - 1
    while (start < end) {
      while (arg[start].completed == false) start++
      while (arg[end].completed == true) end--
      if (start < end) {
        const temp = arg[start]
        arg[start] = arg[end]
        arg[end] = temp
      }
    }
    return arg
  }

  const countTaskDone = (arg) => {
    let counter = 0
    arg.forEach(item => {
      if (item.completed === true) {
        counter++
      }
    })
    setAmountTasksDone(counter)
  }

  const handleSelect = async (userId, option) => {
    setIsLoadingTask(true)
    setTasks([])
    const response = await getTasks(userId)
    const tasksSorted = sortTask(response)
    setTasks(tasksSorted)
    setIsLoadingTask(false)
    countTaskDone(tasksSorted)
    setIsLoadingMarkDone(tasksSorted.map(item => {
      return false
    }))
  }

  const handleMarkDone = async (taskId, index) => {
    setIsLoadingMarkDone(preState => {
      preState[index] = true
      return [...preState]
    })
    const { status, data } = await patchTask(taskId)
    if (status === 200) {
      setTasks((preState) => {
        const listExcluded = preState.filter((item) => {
          if (item.id !== data.id) {
            return true
          }
        })
        return [...listExcluded, data]
      })
      setIsLoadingMarkDone(preState => {
        preState[index] = false
        return [...preState]
      })
      setAmountTasksDone(amountTaskDone + 1)
    }
  }

  return (
    <div className="container">
      <Divider orientation="left" orientationMargin={0}>User</Divider>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a person"
        optionFilterProp="children"
        loading={!users.length ? true : false}
        onChange={handleSelect}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={users.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })}
      />

      <Divider orientation="left" orientationMargin={0}>Tasks</Divider>

      <List
        size="small"
        loading={isLoadingTask}
        style={{ height: 400, overflowY: "auto", marginBottom: 10 }}
        bordered
        dataSource={tasks}
        renderItem={(item, index) => {
          return (
            <List.Item>
              <List.Item.Meta
                description={<Item element={item.title} />}
              />
              {!item.completed ? <Button size="small" loading={isLoadingMarkDone[index]} onClick={() => {handleMarkDone(item.id, index)}}>Mark done</Button> : null}
            </List.Item>
          )
        }
        }
      />
      <div>Done {amountTaskDone}/{tasks.length} tasks</div>
    </div>
  )
}

export default Container