import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Pressable, View } from "react-native";

import Container from "../../../components/Layouts/Container";
import Text from "../../../components/Layouts/Text";
import socket from "../../../lib/socket";
import LoadingScreen from "../../Loading";
import { useGetUserByIdQuery } from "../../../stores/services/user";
import MainButton from "../../../components/Buttons/MainButton";
import PlayerCard from "../../../components/PlayerCard";
import { ISocketData } from "../../../interfaces/ISocketData";

export default function AgainstBotScreen() {
  const navigation = useNavigation()
  const [socketData, setSocketData] = useState<ISocketData>({
    status: "INIT",
  })
  const [opps, setOpps] = useState<any>()
  const { data, isLoading } = useGetUserByIdQuery()
  //@ts-ignore
  const { user } = data

  function handleSocket(data: any) {
    setSocketData(data)
    if (data.status !== "PLEASE WAIT") {
      const [key, opps] = data.room ? Object.entries(data.room.players).find(([key]) => key !== user.username) || [] : []

      setOpps(opps)
    }
  }

  function handleStartGame(data: any) {
    socket.emit("start bot game", { roomId: data.room.id, username: data.username, players: data.room.players })
    navigation.reset({
      index: 0,
      routes: [{ name: "QuestionMultipleChoice", params: { room: data.room, username: data.username, currentQuestion: data.currentQuestion } }],
    })
  }

  function handleCancelBotGame() {
    socket.emit("cancel bot game", socketData.room.id)
    navigation.reset({
      index: 0,
      routes: [{ name: "Play" }]
    })
  }

  useEffect(() => {
    socket.on("initialize game", handleSocket)
    socket.on("opponents found", handleSocket)
    socket.on("start game", handleStartGame)
    return () => {
      socket.off("initialize game", handleSocket)
      socket.off("opponents found", handleSocket)
      socket.off("start game", handleStartGame)
    }
  }, [])


  return (
    <Container style={{ flex: 1 }}>
      {socketData.status === "INIT" ? <LoadingScreen /> :
        <>
          <View style={{ alignItems: "center", justifyContent: "center", gap: 4, marginTop: 16 }}>
            <Text weight={900} style={{ fontSize: 22 }}>{socketData.status}</Text>
            <Text weight={700} style={{ fontSize: 20, marginTop: -10 }}>{socketData.timer}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View>
              <PlayerCard isLoading={isLoading} {...user} />
            </View>
            <Text weight={900} style={{ fontSize: 36, marginVertical: 50 }}>vs</Text>
            <View>
              {socketData.status === "PLEASE WAIT" ?
                <ActivityIndicator />
                //@ts-ignore
                : <PlayerCard {...opps} />
              }
            </View>
          </View>
          {socketData.status !== "PLEASE WAIT" &&
            <View style={{ margin: 16 }}>
              <MainButton variant="primary" onPress={handleCancelBotGame}>
                Cancel Game
              </MainButton>
            </View>}
        </>
      }
    </Container>
  )
}