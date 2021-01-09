import React, { useState, useEffect } from 'react';
import './App.css';
import {Button, Card, DatePicker, Form, Input, Layout, Typography} from 'antd';
import styled from 'styled-components'
import moment from "moment";
import 'moment/locale/ru'
import axios from "axios";  // without this line it didn't work

moment.locale('ru')


const BACKEND_FORMAT = 'YYYY-MM-DD'
const LEFT_ID = 1
const RIGHT_ID = 0



const { Title } = Typography;

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
    width: 100%;
    text-align: center;
    padding: 32px;
    min-height: 100vh;
`

const StyledHeader = styled(Header)`
    display: flex;
    align-items: center;
    
    h1 {
        color: white;
        margin: 0 auto;
    }
`

const StyledContent = styled(Content)`
    padding-top: 32px;
`

const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledCard = styled(Card)`
    margin: 32px;
    border: 1px solid ${props => props.error ? 'red' : 'transparent'}
`

const StyledForm = styled.div`
    margin: 100px auto;
    width: 420px;
    border: 1px solid gray;
    padding: 32px;
    border-radius: 4px;
`

const StyledError = styled.p`
   color: red;
   font-size: 1.5em;
   font-weight: bold;
`


export const App = () => {
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)

    const [errorLeft, setErrorLeft] = useState(false)
    const [errorRight, setErrorRight] = useState(false)


    const [pastLeft, setPastLeft] = useState(0)
    const [pastRight, setPastRight] = useState(0)

    const [error, setError] = useState(false)
    const [date, setDate] = useState()
    const [time, setTime] = useState()


    useEffect(
        () => {
            let timer = setInterval(() => {
                setDate(moment().format('LL'))
                setTime(moment().format('LTS'))
            }, 1000)

            return () => {
                clearTimeout(timer)
            }
        },
        []
    )


    //fetching effects
    useEffect(
        () => {
            let timer = setInterval(() => {
                const timestamp = moment().format(BACKEND_FORMAT)

                fetchData(LEFT_ID, timestamp)
                   .then(data => {
                       setLeft(data.data?.egg_count)
                       setErrorLeft(false)
                   })
                   .catch(err => {
                       console.log(err)
                       setErrorLeft(true)
                   })

                fetchData(RIGHT_ID, timestamp)
                   .then(data => {
                       setRight(data.data?.egg_count)
                       setErrorRight(false)
                   })
                   .catch(err => {
                       console.log(err)
                       setErrorRight(true)
                   })

            }, 10000)

            return () => {
                clearTimeout(timer)
            }
        },
        []
    )


    const fetchData = (id, date) => {
        return axios.post('http://localhost:5000/getCount', {
            "conveyor_id": id,
            "date": date
        })
    }

    const handleChange = value => {
        console.log('Success:', value);

        if (value) {
            const preparedDate = moment(value).format(BACKEND_FORMAT)
            setError(false)

            fetchData(LEFT_ID, preparedDate)
                .then(data => {
                    setPastLeft(data.data?.egg_count)
                })
                .catch(err => {
                    console.log(err)
                    setError(true)
                })

            fetchData(RIGHT_ID, preparedDate)
                .then(data => {
                    setPastRight(data.data?.egg_count)
                })
                .catch(err => {
                    console.log(err)
                    setError(true)
                })

        }
    };

    return (
        <StyledLayout>
            <StyledHeader>
                <Title>CloudVision</Title>
            </StyledHeader>
            <StyledContent>
                <Title level={2}>Веранда №1</Title>
                <Title level={4}>{date} <br/> {time}</Title>
                <StyledWrapper>
                    <StyledCard error={errorLeft} title="Левая Лента">{left}</StyledCard>
                    <StyledCard error={errorRight} title="Правая Лента">{right}</StyledCard>
                </StyledWrapper>

                <StyledForm>
                    <Title level={5}>Здесь можно посмотреть данные счетчика за прошлые дни</Title>
                    <br/>
                    <DatePicker onChange={handleChange} format={'DD/MM/YYYY'}/>
                    <StyledWrapper>
                        <StyledCard error={error} title="Левая Лента">{pastLeft}</StyledCard>
                        <StyledCard error={error} title="Правая Лента">{pastRight}</StyledCard>
                    </StyledWrapper>
                </StyledForm>
                {error && <StyledError>Что-то пошло не так, свяжитесь с поддержкой.</StyledError>}
            </StyledContent>
        </StyledLayout>
    )
}
