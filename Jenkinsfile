/* Scalable Services assignment Remote */

/* build in Master node */
//node{
/* build in Slave node*/
node('slave_A') {
   stage('Checkout Code') { 
     
	 try {
	 sh 'echo "Checkout Code..."'
	  checkout scm
	 }catch (err) {
	  echo "Caught: ${err}"
	  currentBuild.result = 'FAILURE'
	 }
	 
   }
   stage('Docker Build') {
   
		try {
		  if (isUnix()) {
			 
			 sh 'echo "Docker Build..."'
			 sh 'pwd'
			 sh 'ls -ltr'
			 sh 'docker build -t sarafriends1986/edge-remote-node:v_00.00.002 .'
			 
		   } else {
			  echo "Nothing"
		   }
		   
		}catch (err) {
		 echo "Caught: ${err}"
		 currentBuild.result = 'FAILURE'
	    }
	  
   }
   stage('Docker Image Upload') {
   
		try {
		  if (isUnix()) {
		  
			 sh 'echo "Docker Image Upload..."'
			 sh 'pwd'
			 sh 'ls -ltr'
			 sh 'docker images sarafriends1986/edge-remote-node'
			 sh 'docker push sarafriends1986/edge-remote-node:v_00.00.002'
			 
		   } else {
			   echo "Nothing"
		   }
		   
		}catch (err) {
		 echo "Caught: ${err}"
		 currentBuild.result = 'FAILURE'
	    }
	  
   }
   stage('Kubernetes Deployment') {
   
		try {
		  if (isUnix()) {
		  
			 sh 'echo "Kubernetes Deployment..."'
			 sh 'pwd'
			 sh 'ls -ltr'
			 sh 'kubectl get deployments edge-remote-node-deployment -o wide'
			 sh 'kubectl set image deployment/edge-remote-node-deployment edge-remote-node=sarafriends1986/edge-remote-node:v_00.00.002'
			 echo "After Deploying new release version to Kubernetes..."
			 sh 'kubectl get deployments edge-remote-node-deployment -o wide'
			 
		   } else {
			  echo "Nothing"
		   }
		   
		}catch (err) {
		 echo "Caught: ${err}"
		 currentBuild.result = 'FAILURE'
	    }
	  
   }
}