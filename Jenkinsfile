pipeline {
    agent any
    triggers {
        githubPullRequest()
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello, World!'
            }
        }
    }
}