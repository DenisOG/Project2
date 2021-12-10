import React from "react"
import {Switch,Route,Redirect} from 'react-router-dom'
import InstitutePage from './pages/InstitutePage'
import ChairPage from './pages/ChairPage'
import ProfessorPage from './pages/ProfessorPage'
import DirectionPage from './pages/DirectionPage'
import GroupPage from './pages/GroupPage'
import StudentPage from './pages/StudentPage'
import DisciplinePage from './pages/DisciplinePage'
import LaboratoryworkPage from './pages/LaboratoryworkPage'
import ProgressPage from './pages/ProgressPage'
import {AuthPage} from "./pages/AuthPage"

export const  useRoutes = isAuthenticated => {
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/institute" exact>
                    <InstitutePage />
                </Route>
                <Route path="/chair" exact>
                    <ChairPage />
                </Route>
                <Route path="/professor" exact>
                    <ProfessorPage />
                </Route>
                <Route path="/direction" exact>
                    <DirectionPage />
                </Route>
                <Route path="/group" exact>
                    <GroupPage />
                </Route>
                <Route path="/student" exact>
                    <StudentPage />
                </Route>
                <Route path="/discipline" exact>
                    <DisciplinePage />
                </Route>
                <Route path="/laboratorywork" exact>
                    <LaboratoryworkPage />
                </Route>
                <Route path="/progress" exact>
                    <ProgressPage />
                </Route>
                <Redirect to="/progress" />
            </Switch>
        )
    }
    return(
        <Switch>
            <Route path="/"exact>
                <AuthPage />
            </Route>
            <Redirect to='/'/>
        </Switch>
    )
}