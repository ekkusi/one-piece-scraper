for port in 4000 3000
do
  kill -9 $(lsof -t -i:$port) > /dev/null 2> /dev/null || :
done