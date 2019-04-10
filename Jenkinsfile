#!/usr/bin/env groovy

@Library('cals') _

buildConfig {
    dockerNode {
        checkout scm

        def img = docker.image('circleci/node')
        img.pull()

        img.inside {
            stage('Security audit') {
                // We don't fail the job if there are issues. This is so that we
                // don't block unrelated dependency updates. The correct way to
                // handle this would be to block only when a change introduces
                // a vulnerability, but we're not there yet. Should probably
                // use another GitHub status check for that, e.g. by Snyk.
                sh 'npm audit || true'
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