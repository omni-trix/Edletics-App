import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { userAuthState, usePlayerDetails, addAndFetchOpponent, sendAndFetchGameRequest, updateGameRequestStatus } from '../../firebase/firebase'
import { useSelector } from 'react-redux'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native';

const TeamChat = () => {
  const { user } = userAuthState();
  const { playerDetails } = usePlayerDetails(user?.phoneNumber)
  const currentTeam = useSelector(state => state.currentTeam)
  const { addOpponent, fetchOpponentTeams } = addAndFetchOpponent()
  const teams = fetchOpponentTeams(currentTeam)
  const { fetchGameRequest } = sendAndFetchGameRequest()
  const gameRequest = fetchGameRequest(currentTeam?.teamId)
  const { acceptGameRequest, declineGameRequest } = updateGameRequestStatus()
  console.log(gameRequest, "gameRequest")

  return (
    <View style={styles.parent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Opponents</Text>
        {teams?.map((team, index) => {
          return (
            <Pressable key={index} style={styles.newGameContainer} onPress={() => {
              addOpponent(currentTeam?.teamId, currentTeam, team.teamId, team)
            }}>
              <Text style={styles.text}>{team.teamName}</Text>
            </Pressable>
          )
        })}

        <Text style={styles.text}>Game Requests</Text>
        {gameRequest?.map((request, index) => {
          return (
            <Pressable key={index} style={styles.newGameContainer} onPress={() => {
            }}>
              <Text style={styles.text}>{request.date}</Text>
              <Text style={styles.text}>{request.format}</Text>
              <Text style={styles.text}>{request.location}</Text>
              <Text style={styles.text}>{request.mode}</Text>
              {currentTeam?.teamAdmin === playerDetails?.userId &&
                <View style={styles.buttonContainer}>
                  <CustomButton
                    text="Accept"
                    type="TERTIORY"
                    onPress={() => {
                      acceptGameRequest(currentTeam?.teamId, request?.gameRequestId)
                    }}
                  />
                  <CustomButton
                    text="Decline"
                    type="TERTIORY"
                    onPress={() => {
                      declineGameRequest(currentTeam?.teamId, request?.gameRequestId)
                    }}
                  />
                </View>}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default TeamChat

const styles = StyleSheet.create({
  parent: {
    height: "100%",
    backgroundColor: "#101112",
    padding: 10,
  },
  newGameContainer: {
    backgroundColor: 'white',
    minHeight: 150,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "blue",
    fontSize: 20,
    marginVertical: 2
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }
})