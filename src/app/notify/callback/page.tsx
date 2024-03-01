import { GetUuserInfo } from '@/app/dashboard/action';
import { redirect } from 'next/navigation';
import  LineCallback  from '@/components/notify/callback/line_callback'
type Props = {
  params: {};
  searchParams: { [key: string]: string | undefined };
};

const GetToken = async (code: string) => {
  let data;
  const redirect_uri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URL + "/solar/notify/callback";
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('client_id', process.env.NEXT_PUBLIC_LINE_CLIENT_ID||'');
  params.append('client_secret', process.env.NEXT_PUBLIC_LINE_SECRET_ID||'');
  const response = await fetch("https://notify-bot.line.me/oauth/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  if (response.ok) {
    data = await response.json();
  }else{
    throw new Error('requset token not found');
  }
  return data?.access_token;
}

const Home = async (props: Props) => {
  const user = await GetUuserInfo();
  if (! user.username){
    redirect('/login')
  }
  const searchParams = props.searchParams;
  if (searchParams.hasOwnProperty('error')){
    console.error(searchParams.error)
    redirect('/notify/login')
  }
  const code = searchParams.code;
  if (code) {
    try{
      const token = await GetToken(code);
      const body = JSON.stringify({
        line_code : code,
        line_token: token,
        username: user.username
      })
      const url = `http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_HOST_PORT}${process.env.NEXT_PUBLIC_BASE_PATH}/api/line/linetoken`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });
      if (!response.ok) {
        throw new Error('requset token not found');
      }
    }catch(error){
      //redirect('/notify/login')
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <LineCallback props={{"username":user.username}} />
    </div>
  );
};

export default Home;
