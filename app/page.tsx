import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareText, Zap, Share2 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
        Bienvenue sur DataDialog
      </h1>
      <p className="mt-4 max-w-2xl text-lg sm:text-xl text-muted-foreground">
        Une nouvelle façon de communiquer avec des messages structurés. Simplifiez vos échanges, gagnez en clarté et en
        efficacité.
      </p>
      <div className="mt-8">
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link href="/chat">Commencer à Chatter</Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 w-fit">
              <MessageSquareText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Messages Structurés</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Envoyez plus que du simple texte. Utilisez des schémas prédéfinis pour des informations claires et
              standardisées.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 w-fit">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Communication Efficace</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Réduisez les ambiguïtés et accélérez la prise de décision grâce à des données bien organisées directement
              dans vos messages.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 w-fit">
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Extensible & Flexible</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Adaptez DataDialog à vos besoins spécifiques en créant vos propres schémas de messages pour divers cas
              d'usage.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
