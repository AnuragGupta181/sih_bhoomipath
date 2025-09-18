from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable

def fetch_transcript(video_id):
    try:
        transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

        try:
            transcript = transcripts.find_transcript(['en']).fetch()
        except NoTranscriptFound:
            transcript = transcripts.find_generated_transcript(['en']).fetch()

        return " ".join([t["text"] for t in transcript])

    except TranscriptsDisabled:
        return " Transcript disabled for this video."
    except VideoUnavailable:
        return " Video unavailable."
    except NoTranscriptFound:
        return " No transcript found."
    except Exception as e:
        return f" Error: {e}"

if __name__ == "__main__":
    video_id = "FgKEuQZHEWU"  # Replace with your video
    print(fetch_transcript(video_id)[:500])
