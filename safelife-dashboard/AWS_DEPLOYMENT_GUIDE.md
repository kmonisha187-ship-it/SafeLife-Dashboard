# Deploying the SafeLife Dashboard to AWS

Since your current dashboard is a static website (HTML, CSS, JavaScript, and images), the easiest, cheapest, and most robust way to host it on AWS is by using **Amazon S3 Static Website Hosting**.

Here is the complete step-by-step guide to deploying your dashboard from scratch so it is accessible on the internet.

### Prerequisites
1.  **AWS Account:** If you don't have one, go to [aws.amazon.com](https://aws.amazon.com) and click "Create an AWS Account". (You will need a credit card, but hosting this static site will likely fall under the Free Tier or cost just pennies a month).
2.  **Your Dashboard Files:** The files inside your `safelife-dashboard` directory (`index.html`, the `css` folder, the `js` folder, the `images` folder, etc.).

---

### Step 1: Create an S3 Bucket

1. Log in to the [AWS Management Console](https://console.aws.amazon.com).
2. In the search bar at the top, type **S3** and select it.
3. Click the orange **Create bucket** button.
4. **Bucket name:** Enter a unique name for your website (e.g., `safelife-dashboard-yourname-2026`). It must be globally unique across all of AWS.
5. **AWS Region:** Choose a region close to you (e.g., `us-east-1` or `ap-south-1` for India).
6. **Object Ownership:** Leave as *ACLs disabled (recommended)*.
7. **Block Public Access settings for this bucket:** 
   * **Uncheck** the box that says "Block *all* public access". 
   * A warning will appear below it. Check the box to acknowledge that the current settings might result in this bucket and the objects within becoming public. (This is required for a website).
8. Scroll to the bottom and click **Create bucket**.

### Step 2: Enable Static Website Hosting

1. Once the bucket is created, click on its name in the S3 bucket list.
2. Go to the **Properties** tab.
3. Scroll all the way down to the bottom until you see **Static website hosting**.
4. Click **Edit**.
5. Select **Enable**.
6. **Hosting type:** Choose *Host a static website*.
7. **Index document:** Type `index.html`.
8. Scroll down and click **Save changes**. 
9. *Note: If you scroll back down to the Static website hosting section, you will now see a **Bucket website endpoint** link. This will be the URL of your site, but it won't work just yet!*

### Step 3: Add a Bucket Policy to Make it Public

Even though we disabled "Block all public access," we still need to explicitly tell AWS to let anyone read the files.

1. Go to the **Permissions** tab for your bucket.
2. Scroll down to **Bucket policy** and click **Edit**.
3. Paste the following JSON policy into the text editor. **Make sure to replace `YOUR-BUCKET-NAME` with the exact name of your bucket!**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```
4. Click **Save changes**. You should see a red "Publicly accessible" tag appear under your bucket name.

### Step 4: Upload Your Dashboard Files

1. Go to the **Objects** tab for your bucket.
2. Click the orange **Upload** button.
3. You have two options here:
   * **Add files:** Click this, navigate to your `safelife-dashboard` folder on your computer (`C:\Users\Monisha\.gemini\antigravity\scratch\safelife-dashboard`), and select `index.html`.
   * **Add folder:** Click this, and upload the `css`, `js`, and `images` folders one by one.
4. Make sure all your dashboard files and folders are listed in the upload queue.
5. Click the **Upload** button at the bottom. Wait for the upload to reach 100%.
6. Click **Close**.

### Step 5: View Your Live Dashboard!

1. Go back to the **Properties** tab of your bucket.
2. Scroll to the very bottom to the **Static website hosting** section.
3. Click on the **Bucket website endpoint** link (e.g., `http://safelife-dashboard-yourname-2026.s3-website-us-east-1.amazonaws.com`).

Congratulations! Your dashboard is now live on the internet! 

---

### What about the Analytics Pipeline (Glue, EMR, SageMaker, etc.)?
The dashboard you have right now is a **Frontend**. It is the user interface. 
The massive pipeline you described (S3 logs, Glue ETL, EMR, Athena, SageMaker, QuickSight) is a **Backend Data Architecture**. Building that from scratch takes building data generators, configuring multi-stage AWS infrastructure, and writing machine learning models. 

If your goal right now is simply to host the beautiful visual dashboard we built on localhost, just follow the 5 steps above and you will have a live, working URL!
