#!/usr/bin/env groovy

@Library('cals') _

buildConfig {
    dockerNode {
        checkout scm

        def img = docker.image('circleci/node')
        img.pull()

        img.inside {
            stage('Security audit') {
                sh 'npm audit'
            }

            stage('Install dependencies') {
                sh 'npm ci'
            }

            stage('Lint') {
                sh 'npm run lint'
            }

            stage('Tests') {
                sh 'npm test'
            }

            stage('Build') {
                sh 'npm run build'
            }
        }
    }
}