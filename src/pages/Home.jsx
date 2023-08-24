import { useEffect, useState } from 'react';
import { Divider, Select, List, Button } from 'antd';
import { MinusSquareOutlined, CheckCircleOutlined } from '@ant-design/icons/';
import './home.css';

const Home = () => {
  // get users
  const [user, setUser] = useState([]);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((json) => {
        setUser(
          json.map((user) => ({
            label: user.name,
            value: user.id,
          }))
        );
      });
  }, []);
  //\\

  // get tasks
  const [taskId, setTaskId] = useState(null);
  const onChange = (value) => {
    setTaskId(value);
  };
  const [tasks, setTask] = useState([]);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${taskId}/todos`)
      .then((res) => res.json())
      .then((json) => {
        setTask(
          json.map((task) => ({
            userId: taskId,
            id: task.id,
            title: task.title,
            completed: task.completed,
          }))
        );
      });
  }, [taskId]);
  //\\

  // Toggle task status
  const [loadings, setLoadings] = useState([]);
  const toggleTaskStatus = (index, task) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    const toggle = (task) => {
      fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: true,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
          });
        });
    };
    toggle(task);
  };
  //\\

  return (
    <div className='container'>
      <section>
        <Divider orientation='left' orientationMargin='0'>
          User
        </Divider>

        <Select
          showSearch
          optionFilterProp='children'
          onChange={onChange}
          style={{
            width: 200,
          }}
          placeholder='Select user'
          filterOption={(input, option) =>
            (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={user}
        />
      </section>

      <section>
        <Divider orientation='left' orientationMargin='0'>
          Tasks
        </Divider>

        <List
          size='large'
          style={{ height: '500px', overflow: 'auto' }}
          bordered
          dataSource={tasks}
          renderItem={(task, index) => (
            <List.Item>
              {task.completed === true ? (
                <CheckCircleOutlined className='completed-icon' />
              ) : (
                <MinusSquareOutlined className='undone-icon' />
              )}

              {task.title}
              {task.completed === true ? (
                ''
              ) : (
                <Button
                  size='small'
                  style={{ float: 'right' }}
                  loading={loadings[index]}
                  onClick={() => toggleTaskStatus(index, task)}
                >
                  Mark done
                </Button>
              )}
            </List.Item>
          )}
        />
        <div className=' mt-3'>
          Done {tasks.filter((task) => task.completed === true).length}/
          {tasks.map((task) => task.completed).length} Task
        </div>
      </section>
    </div>
  );
};

export default Home;
