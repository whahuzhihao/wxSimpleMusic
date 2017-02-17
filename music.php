<?php
/**
* 部署在服务端的php脚本 从网易云音乐获取音乐列表
**/
const PAGE_NUM = 20;

function curl_post_contents($url, $data, $cookie = "Cookie: " . "appver=1.5.0.75771;", $second = 10, $content_type = 'application/x-www-form-urlencoded')
{
    $url_arr = parse_url($url);

    $header[] = "Referer: " . $url_arr['scheme'] . "://" . $url_arr['host'] . "/";
    $header[] = "Host: " . $url_arr['host'];
    $header[] = "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; zh-CN; rv:1.9.0.8) Gecko/2009032609 Firefox/3.0.8 (.NET CLR 3.5.30729)";
    $header[] = "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    $header[] = "Accept-Language: zh-cn,zh;q=0.5";
    $header[] = "Accept-Charset: utf8";
    $header[] = "Cache-Control: no-cache";
    $header[] = "Content-type: {$content_type}";
    if (is_array($data)) {
        $data = http_build_query($data);
    }
    $header[] = "Content-length: " . strlen($data);
    $header[] = "Connection: close";
    $header[] = $cookie;

    $refer = "http://music.163.com/";

    $ch = curl_init();
    if ($ch !== false) {
//        curl_setopt($ch, CURLOPT_REFERER, $refer);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//        curl_setopt($ch, CURLOPT_COOKIE, $cookie);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, $second);
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);//支持重定向
        curl_setopt($ch, CURLOPT_MAXREDIRS, 2);//最大重定向两次

        $content = curl_exec($ch);
        $last_retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($last_retcode != 200) { //返回错误
            $content = false;

        }
        curl_close($ch);
        unset($ch);
    } else {
        $content = false;
    }
    return $content;
}

function curl_get_contents_contents($url, $second = 10, $ip = '', $cookie =  "Cookie: " . "appver=1.5.0.75771;", $verifyCA = true, &$errorMsg = "")
{
    $url_arr = parse_url($url);
    $header[] = "Referer: " . $url_arr['scheme'] . "://" . $url_arr['host'] . "/";
    $header[] = "Host: " . $url_arr['host'];
    $header[] = "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; zh-CN; rv:1.9.0.8) Gecko/2009032609 Firefox/3.0.8 (.NET CLR 3.5.30729)";
    $header[] = "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    $header[] = "Accept-Language: zh-cn,zh;q=0.5";
    $header[] = "Accept-Charset: utf8";
    $header[] = "Connection: close";
    $header[] = $cookie;
    $ch = curl_init();
    if ($ch !== false) {
        if ($ip != '') {
            $url = str_replace($url_arr['scheme'] . "://" . $url_arr['host'] . "/", $url_arr['scheme'] . "://" . $ip . "/", $url, $count);
            if ($count != 1) {
                curl_close($ch);
                return false;
            }
        }
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, $second);
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);//支持重定向
        curl_setopt($ch, CURLOPT_MAXREDIRS, 2);//最大重定向两次
        if (false == $verifyCA) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }
        $content = curl_exec($ch);
        $last_retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($last_retcode != 200) {
            $errorMsg = "call http err :" . curl_errno($ch) . "-" . curl_error($ch);
            //返回错误
            $content = false;
        }
        curl_close($ch);
        unset($ch);
    } else {
        curl_close($ch);
        $content = false;
    }
    return $content;

}

function music_search($word, $page = 1, $type = 1){
    $url = "http://music.163.com/api/search/pc";
    $post_data = array(
        's' => $word,
        'offset' => 0 + ($page-1) * PAGE_NUM,
        'limit' => PAGE_NUM,
        'type' => $type,
    );
    return curl_post_contents($url, $post_data);
}

function get_music_info($music_id)
{
    $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
    return curl_get_contents($url);
}

function get_artist_album($artist_id, $limit)
{
    $url = "http://music.163.com/api/artist/albums/" . $artist_id . "?limit=" . $limit;
    return curl_get_contents($url);
}

function get_album_info($album_id)
{
    $url = "http://music.163.com/api/album/" . $album_id;
    return curl_get_contents($url);
}

function get_playlist_info($playlist_id)
{
    $url = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
    return curl_get_contents($url);
}

function get_music_lyric($music_id)
{
    $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $music_id . "&lv=-1&kv=-1&tv=-1";
    return curl_get_contents($url);
}

function get_mv_info()
{
    $url = "http://music.163.com/api/mv/detail?id=319104&type=mp4";
    return curl_get_contents($url);
}

$keyWord = $_REQUEST['k'];
$page = $_REQUEST['p'];
if($keyWord === '' || is_null($keyWord)){
    $keyWord = '珊瑚海';
}
if($page === '' || is_null($page)){
    $page = '1';
}

$list = music_search($keyWord, $page);
//echo $list;exit;
$list = json_decode($list, true);
if($list['code'] != '200'){
    return $this->show(-1);
}
$songList = $list['result']['songs'];
$result = array();
foreach($songList as $row){
    $item = array(
        'url' => $row['mp3Url'],
        'duration' => $row['duration'],
        'status' => $row['status'],//0可用,
        'name' => $row['name'],
        'commentThreadId' => $row['commentThreadId'],
        'fee' => $row['fee'],
        'alias' => $row['alias'],//是一个数组
        'artists' => array(),
        'transNames' => $row['transNames'],//译名 是一个数组
        'id' => $row['id'],
        'album' => $row['album']['name'],//可能没有
	'pic' => $row['album']['picUrl'],
    );
    foreach($row['artists'] as $artist){
        $item['artists'][] = $artist['name'];
    }
    $result[] = $item;
}

return show(0, $result);

function show($code = 0, $data = array()){
    $result = array(
        'code' => 0,
        'data' => $data
    );
    echo json_encode($result);
    return;
}
